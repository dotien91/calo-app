export interface ILiveData {
  rtmp_url: string;
  m3u8_url: string;
  ingest_endpoint?: string;
  stream_key: string;
  _id: string;
  video_thumbnail: string;
}

export interface IUSerStream {
  official_status?: boolean;
  _id: string;
  user_login?: string;
  user_avatar?: string;
  user_avatar_thumbnail?: string;
  display_name?: string;
  user_role?: string;
  user_status: number;
  last_active?: string;
  user_active: number;
}

export interface IStreamItem {
  _id: string;
  user_id: IUSerStream;
  language?: string;
  cover_url?: string;
  "media_id?": string;
  title?: string;
  caption?: string;
  cookies?: string;
  ref_id?: string;
  product_id?: string;
  country?: string;
  like_number: 0;
  view_number: 1;
  comment_number: 0;
  livestream_status?: string;
  ready_status?: string;
  input_type?: string;
  livestream_source?: string;
  whip_data?: string;
  whep_data?: string;
  cloudflare_stream_id?: string;
  react_value: any;
  livestream_data: ILiveData;
  is_join: boolean;
}
