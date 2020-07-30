export interface EmbedThumbnail {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedVideo {
  url?: string;
  height?: number;
  width?: number;
}

export interface EmbedImage {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedProvider {
  name?: string;
  url?: string;
}

export interface EmbedAuthor {
  name?: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedFooter {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedMessage {
  title?: string;
  type?: "rich" | "image" | "video" | "gifv" | "article" | "link";
  description?: string;
  url?: string;
  timestamp?: Date;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  video?: EmbedVideo;
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

export class EmbedMessageBuilder {
  constructor(private readonly obj: EmbedMessage = {}) {}

  color(color: number): EmbedMessageBuilder {
    return new EmbedMessageBuilder({ ...this.obj, color });
  }

  url(url: string): EmbedMessageBuilder {
    return new EmbedMessageBuilder({ ...this.obj, url });
  }

  title(title: string): EmbedMessageBuilder {
    return new EmbedMessageBuilder({ ...this.obj, title });
  }

  description(description: string): EmbedMessageBuilder {
    return new EmbedMessageBuilder({ ...this.obj, description });
  }

  author(author: Readonly<EmbedAuthor>): EmbedMessageBuilder {
    return new EmbedMessageBuilder({ ...this.obj, author });
  }

  footer(footer: Readonly<EmbedFooter>): EmbedMessageBuilder {
    return new EmbedMessageBuilder({ ...this.obj, footer });
  }

  field(field: Readonly<EmbedField>): EmbedMessageBuilder {
    return new EmbedMessageBuilder(
      { ...this.obj, fields: [...(this.obj.fields || []), field] },
    );
  }

  fields(...fields: readonly Readonly<EmbedField>[]): EmbedMessageBuilder {
    return new EmbedMessageBuilder({ ...this.obj, fields: [...fields] });
  }

  raw(): EmbedMessage {
    return { ...this.obj };
  }
}
