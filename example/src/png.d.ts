declare module '*.png' {
  import { ImgHTMLAttributes } from 'react';

  const Image: NonNullable<ImgHTMLAttributes<any>['src']>;
  export default Image;
}
