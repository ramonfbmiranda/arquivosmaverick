from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# Models
class Member(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    nickname: str
    classification: str
    description: str
    characteristics: List[str]
    current_status: str
    role: str
    photo_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MemberCreate(BaseModel):
    name: str
    nickname: str
    classification: str
    description: str
    characteristics: List[str]
    current_status: str
    role: str
    photo_url: Optional[str] = None

class MemberUpdate(BaseModel):
    name: Optional[str] = None
    nickname: Optional[str] = None
    classification: Optional[str] = None
    description: Optional[str] = None
    characteristics: Optional[List[str]] = None
    current_status: Optional[str] = None
    role: Optional[str] = None
    photo_url: Optional[str] = None

class Comment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    member_id: str
    author_name: str
    text: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommentCreate(BaseModel):
    member_id: str
    author_name: str
    text: str

class Quote(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    member_id: Optional[str] = None
    text: str
    context: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuoteCreate(BaseModel):
    member_id: Optional[str] = None
    text: str
    context: Optional[str] = None

class Photo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    caption: Optional[str] = None
    member_ids: List[str] = []
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PhotoCreate(BaseModel):
    url: str
    caption: Optional[str] = None
    member_ids: List[str] = []


# Member Routes
@api_router.get("/")
async def root():
    return {"message": "Gangue da Maverick API"}

@api_router.post("/members", response_model=Member)
async def create_member(input: MemberCreate):
    member_dict = input.model_dump()
    member_obj = Member(**member_dict)
    doc = member_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.members.insert_one(doc)
    return member_obj

@api_router.get("/members", response_model=List[Member])
async def get_members():
    members = await db.members.find({}, {"_id": 0}).to_list(1000)
    for member in members:
        if isinstance(member['created_at'], str):
            member['created_at'] = datetime.fromisoformat(member['created_at'])
    return members

@api_router.get("/members/{member_id}", response_model=Member)
async def get_member(member_id: str):
    member = await db.members.find_one({"id": member_id}, {"_id": 0})
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    if isinstance(member['created_at'], str):
        member['created_at'] = datetime.fromisoformat(member['created_at'])
    return member

@api_router.put("/members/{member_id}", response_model=Member)
async def update_member(member_id: str, input: MemberUpdate):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.members.update_one({"id": member_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member = await db.members.find_one({"id": member_id}, {"_id": 0})
    if isinstance(member['created_at'], str):
        member['created_at'] = datetime.fromisoformat(member['created_at'])
    return member

@api_router.delete("/members/{member_id}")
async def delete_member(member_id: str):
    result = await db.members.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    return {"message": "Member deleted successfully"}


# Comment Routes
@api_router.post("/comments", response_model=Comment)
async def create_comment(input: CommentCreate):
    comment_dict = input.model_dump()
    comment_obj = Comment(**comment_dict)
    doc = comment_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.comments.insert_one(doc)
    return comment_obj

@api_router.get("/comments/{member_id}", response_model=List[Comment])
async def get_comments(member_id: str):
    comments = await db.comments.find({"member_id": member_id}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    for comment in comments:
        if isinstance(comment['timestamp'], str):
            comment['timestamp'] = datetime.fromisoformat(comment['timestamp'])
    return comments


# Quote Routes
@api_router.post("/quotes", response_model=Quote)
async def create_quote(input: QuoteCreate):
    quote_dict = input.model_dump()
    quote_obj = Quote(**quote_dict)
    doc = quote_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.quotes.insert_one(doc)
    return quote_obj

@api_router.get("/quotes", response_model=List[Quote])
async def get_quotes():
    quotes = await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for quote in quotes:
        if isinstance(quote['created_at'], str):
            quote['created_at'] = datetime.fromisoformat(quote['created_at'])
    return quotes

@api_router.delete("/quotes/{quote_id}")
async def delete_quote(quote_id: str):
    result = await db.quotes.delete_one({"id": quote_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"message": "Quote deleted successfully"}


# Photo Routes
@api_router.post("/photos", response_model=Photo)
async def create_photo(input: PhotoCreate):
    photo_dict = input.model_dump()
    photo_obj = Photo(**photo_dict)
    doc = photo_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.photos.insert_one(doc)
    return photo_obj

@api_router.get("/photos", response_model=List[Photo])
async def get_photos():
    photos = await db.photos.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    for photo in photos:
        if isinstance(photo['timestamp'], str):
            photo['timestamp'] = datetime.fromisoformat(photo['timestamp'])
    return photos

@api_router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str):
    result = await db.photos.delete_one({"id": photo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": "Photo deleted successfully"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
