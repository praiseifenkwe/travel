from fastapi import APIRouter, Query
from app.models.schemas import FlightListResponse
from app.services.flight_service import get_flight_options

router = APIRouter(prefix="/flights", tags=["Flights"])

@router.get("", response_model=FlightListResponse)
async def get_flights(
    application_id: str = Query(None),
    destination: str = Query("United Kingdom")
):
    flights = get_flight_options(destination=destination)
    return FlightListResponse(
        application_id=application_id,
        destination=destination,
        flights=flights
    )
