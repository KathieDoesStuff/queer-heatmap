from dataclasses import dataclass


@dataclass
class Moment:
    lat: int
    lng: int
    message: str
    id: int
