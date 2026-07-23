// "use client";

// import { useEffect, useState } from "react";

// type ProfilePhotoProps = {
//   src: string;
//   alt: string;
//   className?: string;
//   fallbackClassName?: string;
// };

// const localFallback = "/profile.jpg";

// /**
//  * Shows the saved profile image, then the local uploaded image, and finally a
//  * visible initials placeholder. This means a broken third-party image link can
//  * never make the photo area disappear.
//  */
// export function ProfilePhoto({
//   src,
//   alt,
//   className = "",
//   fallbackClassName = "",
// }: ProfilePhotoProps) {
//   const initialSource = src.trim() || localFallback;
//   const [imageSource, setImageSource] = useState(initialSource);
//   const [showPlaceholder, setShowPlaceholder] = useState(false);

//   useEffect(() => {
//     setImageSource(initialSource);
//     setShowPlaceholder(false);
//   }, [initialSource]);

//   if (showPlaceholder) {
//     return (
//       <div
//         aria-label={alt}
//         role="img"
//         className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-violet-600 text-4xl font-bold text-white ${fallbackClassName}`}
//       >
//         FB
//       </div>
//     );
//   }

//   return (
//     <img
//       src={imageSource}
//       alt={alt}
//       className={className}
//       onError={() => {
//         if (imageSource !== localFallback) {
//           setImageSource(localFallback);
//         } else {
//           setShowPlaceholder(true);
//         }
//       }}
//     />
//   );
// }
