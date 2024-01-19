import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface CommentFormProps {
  storeId: number;
  refetch: () => void;
}

export default function CommentForm({ storeId, refetch }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    resetField, //제출을 한 이후에 필드를 다 reset 시키기 위해서
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const result = await axios.post("/api/comments", {
          ...data,
          storeId,
        });

        if (result.status === 200) {
          toast.success("댓글을 등록했습니다.");
          resetField("body"); //댓글 등록완료했으니 body값 초기화
          refetch?.(); //refetch있는 경우에만 호출해라
        } else {
          toast.error("다시 시도해주세요");
        }
      })}
      className="flex flex-col space-y-2"
    >
      {errors?.body?.type === "required" && ( //해당 필드요소가 필수인데 적지 않은 경우
        <div className="text-xs text-red-600">필수 입력사항입니다.</div>
      )}
      <textarea
        rows={3} //3줄
        placeholder="댓글을 작성해주세요..."
        {...register("body", { required: true })}
        className="block w-full min-h-[120px] resize-none border rounded-md bg-transparent py-2.5 px-4 text-black placeholder:text-gray-400 text-sm leading-6"
        //resize가 가능한 textarea를 못하게 resize-none을 함
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm font-semibold shadow-sm mt-2 rounded-md"
      >
        작성하기
      </button>
    </form>
  );
}
