import { TypedMedia, TypedUser } from "shared/models";

export interface TypedRoomLiveStream {
  caption?: string;
  comment_number?: number;
  country?: string;
  createdAt?: string;
  hashtag_id?: string[];
  is_like?: boolean;
  is_view?: boolean;
  language?: string;
  like_number?: number;
  livestream_status?: "wait" | "live" | "end";
  media_id?: any;
  music_id?: any[];
  updatedAt?: string;
  user_id?: TypedUser;
  view_number?: number;
  _id?: string;
  title?: string;
  start_time?: string;
  avatar?: TypedMedia;
  input_type?: string;
  livestream_data?: {
    ingest_endpoint: string;
    m3u8_url: string;
    rtmp_url: string;
    stream_key: string;
  };
  ready_status?: string;
  history_media?: {
    created: string;
    modified: string;
    playback: {
      dash: string;
      hls: string;
    };
    thumbnail: string;
    uid: string;
    _id: string;
  }[];
}

export interface TypedReaction {
  id: string;
  react_type: string;
  createBy: TypedUser;
}

export interface TypedCommentLiveStream {
  _id: string;
  user_type: string;
  parent_id: any;
  livestream_id: string;
  chat_content: string;
  media_ids: any[];
  chat_type: string;
  chat_status: string;
  send_at: string;
  read_at: string;
  createBy: TypedUser;
  createdAt: string;
  updatedAt: string;
}
