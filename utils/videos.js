import {getWatchedVideos, getMyListVideos} from '../utils/hasura'

const fetchVideo = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API;
  const BASE_URL = `youtube.googleapis.com/youtube/v3`;
  const response = await fetch(
    `https://${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`
  );
  return await response.json();
};

export const getCommonVideos = async (url) => {
  try {
    const isDev = process.env.DEVELOPMENT === 'false'
    const data = isDev ? {} : await fetchVideo(url);

    if (data?.error) {
      console.error("Youtube API error", data.error);
      return [];
    }

    return data?.items.map((item) => {
      const id = item.id?.videoId || item.id;
      const snippet = item.snippet;
      return {
        title: snippet?.title,
        imgUrl: snippet.thumbnails.high.url,
        id,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (err) {
    console.error("SOmething went wrong with getVideo", err);
  }
};

export const getVideos = async (query) => {
  const PARAMS = `search?part=snippet&type=video&maxResults=25&q=${query}`;
  return await getCommonVideos(PARAMS);
};

export const getPopularVideos = async () => {
  const PARAMS = `videos?part=snippet&chart=mostPopular&maxResults=25&regionCode=SG`;
  return await getCommonVideos(PARAMS);
};

export const getVideoById = async (videoId) => {
  const PARAMS = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return await getCommonVideos(PARAMS);
};

export const getWatchItAgainVideos = async (userId, token) => {
  try {
    const videos = await getWatchedVideos(userId, token)
    return videos.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
      }
    })
  } catch (err) {
    console.error('Something went wrong with getting watch it again videos', {err})
  }
}


export const getFavouritedVideos = async (userId, token) => {
  try {
    const videos = await getMyListVideos(userId, token)
    return videos.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
      }
    })
  } catch (err) {
    console.error('Something went wrong with getting watch it again videos', {err})
  }
}