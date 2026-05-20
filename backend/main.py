import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import livekit.api

load_dotenv()
origins = [
    "http://localhost:3000",   # Typical React/Next.js dev port
    "http://localhost:5173",   # Typical Vite dev port
    # "https://your-production-domain.com",
    # "https://raw-webrtc-three.vercel.app"
    "https://webrtc_with_livekit.vercel.app"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_token(identity : str):
    return (
        livekit.api
        .AccessToken()
        .with_identity(identity=identity)
        .with_name(identity)
        .with_grants(livekit.api.VideoGrants(
            room_join=True,
            room="myroom",
        ))
    ).to_jwt()

@app.get('/')
async def home():
    generate_token("Manav")
    return {"success" : "ok"}

@app.get('/token')
async def get_token(identity : str):
    return {
        "token" : generate_token(identity),
        "url" : os.getenv("LIVEKIT_URL")
    }