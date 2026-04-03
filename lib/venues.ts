/**
 * Yelp Fusion API — venue sourcing for boba/matcha near a midpoint.
 */

export interface Venue {
    name: string;
    address: string;
    mapsLink: string;
    rating: number;
    distanceFromMidpoint?: number;
}

/**
 * Find the best boba/matcha venue near a geographic midpoint.
 * Searches for places, sorts by rating, picks closest.
 */
export async function findBestVenue(
    midpointLat: number,
    midpointLng: number
): Promise<Venue | null> {
    // Note: Reusing the same concept, but the env var will be YELP_API_KEY
    const apiKey = process.env.YELP_API_KEY || process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        console.error("Yelp API key not configured");
        return null;
    }

    try {
        const url = new URL("https://api.yelp.com/v3/businesses/search");
        url.searchParams.set("latitude", midpointLat.toString());
        url.searchParams.set("longitude", midpointLng.toString());
        url.searchParams.set("radius", "3000"); // 3km radius from midpoint
        url.searchParams.set("term", "boba matcha bubble tea");
        url.searchParams.set("categories", "bubbletea,coffee,tea");
        url.searchParams.set("sort_by", "rating");
        url.searchParams.set("limit", "10");

        const response = await fetch(url.toString(), {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                accept: 'application/json'
            }
        });

        const data = await response.json();

        if (!data.businesses || data.businesses.length === 0) {
            console.warn("No venues found via Yelp.");
            return null;
        }

        // Yelp already returns items. Let's filter top rated
        const places = data.businesses;

        const topRated = places
            .filter((p: any) => (p.rating || 0) >= 3.5)
            .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));

        if (topRated.length === 0) {
            // Fallback: just use the first result
            const p = places[0];
            const displayAddress = p.location?.display_address?.join(", ") || "Unknown Address";
            return {
                name: p.name,
                address: displayAddress,
                mapsLink: p.url, // Yelp provides a direct URL to their venue page
                rating: p.rating || 0,
            };
        }

        // Pick closest among top rated
        const withDistance = topRated.map((p: any) => ({
            ...p,
            calcDistance: haversineDistance(
                midpointLat,
                midpointLng,
                p.coordinates.latitude,
                p.coordinates.longitude
            ),
        }));

        withDistance.sort((a: any, b: any) => a.calcDistance - b.calcDistance);

        const best = withDistance[0];
        const displayAddress = best.location?.display_address?.join(", ") || "Unknown Address";

        // Generate a Google Maps search link based on coordinates just to be safe,
        // or just use Yelp url. Let's use Google Route to their address for UX.
        const encodedAddress = encodeURIComponent(`${best.name} ${displayAddress}`);
        const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

        return {
            name: best.name,
            address: displayAddress,
            mapsLink: googleMapsLink, // Much better UX to give them a Google Maps routing link
            rating: best.rating || 0,
            distanceFromMidpoint: best.calcDistance,
        };
    } catch (error) {
        console.error("Yelp API error:", error);
        return null;
    }
}

/**
 * Haversine distance in meters between two lat/lng pairs.
 */
function haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371e3; // Earth radius in meters
    const toRad = (n: number) => (n * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
