export default function Loader({ className = "" }) {
  return (
    <div className={`flex gap-4 justify-center mt-10 ${className}`}>
      {/* 테일윈드 애니메이션으로 사용해 쉽게 애니메이션 적용 */}
      <div className="w-2 h-2 animate-ping rounded-full bg-gray-500" />
      <div className="w-2 h-2 animate-ping rounded-full bg-gray-500" />
      <div className="w-2 h-2 animate-ping rounded-full bg-gray-500" />
    </div>
  );
}
