from fastapi import FastAPI
import uvicorn

# Create a new FastAPI instance with minimal configuration
app = FastAPI()

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Solar System API is running"}

@app.get("/api/planets")
async def get_planets():
    planets = [
        {"name": "Mercury", "distance": 0.39, "radius": 2439.7},
        {"name": "Venus", "distance": 0.72, "radius": 6051.8},
        {"name": "Earth", "distance": 1.0, "radius": 6371.0},
        {"name": "Mars", "distance": 1.52, "radius": 3389.5},
        {"name": "Jupiter", "distance": 5.20, "radius": 69911},
        {"name": "Saturn", "distance": 9.58, "radius": 58232},
        {"name": "Uranus", "distance": 19.18, "radius": 25362},
        {"name": "Neptune", "distance": 30.07, "radius": 24622}
    ]
    return {"planets": planets}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
