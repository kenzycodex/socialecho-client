import { useNavigate, useLocation } from "react-router";
import { useMemo } from "react";
import noPost from "../../assets/nopost.jpg";

const PostOnProfile = ({ post }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isImageFile = useMemo(() => {
    if (!post?.fileUrl) return false;
    const validExtensions = [".jpg", ".png", ".jpeg", ".gif", ".webp", ".svg"];
    const fileExtension = post.fileUrl.slice(post.fileUrl.lastIndexOf(".")).toLowerCase();
    return validExtensions.includes(fileExtension);
  }, [post?.fileUrl]);

  // Early return checks after all hooks
  if (!post) {
    return null;
  }

  const { content, fileUrl, community, createdAt, comments = [], likes = [], isMember } = post;

  if (!community) {
    return null;
  }

  const handlePostClick = () => {
    if (isMember && post._id) {
      navigate(`/my/post/${post._id}`, {
        state: { from: location.pathname },
      });
    }
  };

  return (
    <div
      className={`bg-white rounded-md p-3 border my-2 cursor-pointer transition-all duration-300 ${
        isMember ? "hover:shadow-md" : "opacity-50 pointer-events-none"
      }`}
      onClick={handlePostClick}
    >
      <div className="flex items-center">
        <p className="text-sm text-gray-500">
          Posted in {community.name} • {createdAt}
        </p>
      </div>
      <div className="my-3">
        {content && <p className="mb-4">{content}</p>}
        {fileUrl && isImageFile ? (
          <div className="w-full aspect-w-1 aspect-h-1">
            <img
              className="w-full h-full object-cover rounded-md cursor-pointer"
              src={fileUrl}
              alt={content || "Post image"}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = {noPost};
              }}
            />
          </div>
        ) : (
          fileUrl && (
            <div className="w-full aspect-w-16 aspect-h-9">
              <video
                className="w-full h-full object-cover rounded-md cursor-pointer"
                src={fileUrl}
                controls
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            </div>
          )
        )}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {comments?.length || 0} {(comments?.length === 1) ? "Comment" : "Comments"}
            </span>
            <span className="text-sm text-gray-500">
              {likes?.length || 0} {(likes?.length === 1) ? "Like" : "Likes"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOnProfile;
