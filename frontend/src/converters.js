export const CONVERTERS = [
  // Images
  { id: "jpg-to-png",  from: "JPG",  to: "PNG",  category: "Image",  icon: "🖼️",  popular: true,  desc: "Convert JPEG images to PNG format with transparency support." },
  { id: "png-to-jpg",  from: "PNG",  to: "JPG",  category: "Image",  icon: "🖼️",  popular: true,  desc: "Compress PNG files to smaller JPG format for sharing and web use." },
  { id: "heic-to-jpg", from: "HEIC", to: "JPG",  category: "Image",  icon: "📱",  popular: false, desc: "Convert iPhone HEIC photos to universal JPG format." },
  { id: "webp-to-png", from: "WebP", to: "PNG",  category: "Image",  icon: "🌐",  popular: false, desc: "Convert modern WebP images to widely-supported PNG format." },

  // Audio
  { id: "mp3-to-wav",  from: "MP3",  to: "WAV",  category: "Audio",  icon: "🎵",  popular: true,  desc: "Convert compressed MP3 files to lossless WAV audio." },
  { id: "wav-to-flac", from: "WAV",  to: "FLAC", category: "Audio",  icon: "🎵",  popular: false, desc: "Convert WAV files to space-saving lossless FLAC format." },
  { id: "flac-to-mp3", from: "FLAC", to: "MP3",  category: "Audio",  icon: "🎶",  popular: false, desc: "Convert FLAC audio to portable MP3 for any device." },
  { id: "ogg-to-mp3",  from: "OGG",  to: "MP3",  category: "Audio",  icon: "🎶",  popular: false, desc: "Convert OGG Vorbis files to universal MP3 format." },

  // Video
  { id: "mp4-to-mp3",  from: "MP4",  to: "MP3",  category: "Video",  icon: "🎬",  popular: true,  desc: "Extract audio from MP4 video files as MP3." },
  { id: "mp4-to-mov",  from: "MP4",  to: "MOV",  category: "Video",  icon: "🎬",  popular: true,  desc: "Convert MP4 videos to MOV format for Apple devices." },
  { id: "mov-to-mp4",  from: "MOV",  to: "MP4",  category: "Video",  icon: "📹",  popular: false, desc: "Convert Apple MOV videos to universal MP4 format." },

  // Document
  { id: "pdf-to-word", from: "PDF",  to: "DOCX", category: "Document", icon: "📄", popular: true, desc: "Convert PDF documents to editable Microsoft Word files." },
];

export const CATEGORIES = ["All", "Image", "Audio", "Video", "Document"];

export function getConverter(id) {
  return CONVERTERS.find(c => c.id === id);
}
