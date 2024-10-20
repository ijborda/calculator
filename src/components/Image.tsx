import React, { type ReactElement } from 'react';
import Image, { ImageProps } from 'next/image';

interface Props {
  className?: string;
  aspectRatio?: number;
}

export default function Component(props: Props & ImageProps): ReactElement {
  return (
    <div>
      <div
        className={props.className ?? ''}
        style={{
          // width and aspect-ratio controls the size
          width: props.width,
          aspectRatio: props.aspectRatio,
          position: 'relative',
          margin: 'auto',
        }}
      >
        <Image src={props.src} fill={true} alt={props.alt} />
      </div>
    </div>
  );
}
