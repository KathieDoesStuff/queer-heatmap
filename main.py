import xmltodict
from unidecode import unidecode

import api

moments = api.get_moments()
momentsKml = {
    'kml': {
        '@xmlns': 'http://earth.google.com/kml/2.0',
        '@xmlns:atom': 'http://www.w3.org/2005/Atom',
        'Document': {
            'name': 'qtm moments',
            'atom:author': {
                'atom:name': 'Kathie :3'
            },
            'atom:link': {
                '@href': 'https://www.queeringthemap.com/'
            },
            "Folder": {
                "name": "qtm moments",
                "Placemark": [
                    {
                        "@id": i.id,
                        "description":
                            unidecode(i.message)
                            .encode("cp1252", errors="ignore")
                            .decode("utf-8", errors="ignore"),
                        "Point": {
                            "coordinates": f"{i.lng},{i.lat},0"
                        }
                    } for i in moments
                ]
            }
        }
    }
}

f = open("ui/public/moments.kml", "w")
f.write(xmltodict.unparse(momentsKml, pretty=True, encoding="utf-8"))
f.close()
