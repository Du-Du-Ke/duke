import fetch from 'node-fetch';

export interface TrackDeets {
  artiste: string;
  title: string;
  annieURL: string;
}

interface AnnieResponse {
  status: string;
  data: {
    url_type: string;
    track_details: {
      id: number;
      title: string;
      artiste: string;
      platforms: {
        name: string;
        url: string;
      }[];
    }
  }
}

type AnnieSearchBody = { url: string };

class AnnieClient {
  public baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.ANNIE_BASE_URL}/search`;
  }

  async client<T extends object, U extends object>(method: string, payload: T): Promise<U> {
    const result = await fetch(this.baseUrl, {
      method,
      body: JSON.stringify(payload),
      headers: {'Content-Type': 'application/json'}
    });

    const response = await result.json();
    if (result.ok) {
      return Promise.resolve(response as U);
    }
    return Promise.reject(response);
  }

  async getTrackDetails(link: string): Promise<TrackDeets> {
    const trackInfo = await this.client<AnnieSearchBody, AnnieResponse>('post', { url: link });
    if (trackInfo.status === 'success' && trackInfo.data.url_type === 'TRACK') {
      return Promise.resolve({
        artiste: trackInfo.data.track_details.artiste,
        title: trackInfo.data.track_details.title,
        annieURL: trackInfo.data.track_details.platforms[0].url
      });
    }
    return Promise.reject(`unknown track info. status: ${trackInfo.status}`)
  }

  // TODO: @BolajiOlajide improve this check for annie, this is a poor man's check lol
  canConvert(link: string): boolean {
    const lowerCasedLink = link.toLowerCase()
    return (
      lowerCasedLink.startsWith('https://open.spotify.com/track') ||
      lowerCasedLink.startsWith('https://www.open.spotify.com/track') ||
      lowerCasedLink.startsWith('https://music.apple.com') ||
      lowerCasedLink.startsWith('https://www.music.apple.com') ||
      lowerCasedLink.startsWith('https://deezer.page.link') ||
      lowerCasedLink.startsWith('https://www.deezer.page.link')
    );
  }
}

export default AnnieClient;
