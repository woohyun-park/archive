import { IComment, IUser } from "apis/def";

import { Icon } from "components/atoms";
import ProfileImg from "components/ProfileImg";
import { displayCreatedAt } from "apis/time";

type ICommentProps = {
  comment: IComment;
  user: IUser;
  curUser: IUser;

  onProfileClick?: () => void;
  onDelete?: () => void;
};

export default function Comment({
  comment,
  user,
  curUser,
  onProfileClick = () => {},
  onDelete = () => {},
}: ICommentProps) {
  return (
    <div className="flex items-end justify-between my-1">
      <div className="flex items-center mt-2 mb-1">
        <ProfileImg size="sm" photoURL={user?.photoURL || ""} onClick={onProfileClick} />
        <div className="ml-2">
          <div className="flex items-center">
            <div
              className="mr-1 text-sm font-bold text-black hover:cursor-pointer"
              onClick={onProfileClick}
            >
              {user?.displayName}
            </div>
            <div className="text-xs text-gray-1">{displayCreatedAt(comment.createdAt)}</div>
          </div>
          <div className="-mt-[0.125rem] text-base leading-5 text-black break-all">
            {comment?.txt}
          </div>
        </div>
      </div>
      {user?.id === curUser.id && (
        <Icon
          icon="x"
          size="sm"
          className="mx-2 mt-5 hover:cursor-pointer self-baseline"
          onClick={onDelete}
        />
      )}
    </div>
  );
}
