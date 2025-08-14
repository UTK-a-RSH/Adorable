import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Logo from "./Logo";

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment | null) => void;
  type: MessageType;
}

interface UserMessageProps {
  content: string;
}

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment | null) => void;
  type: MessageType;
}

interface FragmentCardProps {
  fragment: Fragment | null;
  isActive: boolean;
  onClick: (fragment: Fragment | null) => void;
}

const UserMessage = ({content}: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <div className="max-w-[80%]">
        <div className="flex items-center justify-end gap-2 mb-1 text-xs text-gray-500">
          <span className="font-medium">You</span>
        </div>
        <Card className="rounded-lg bg-blue-500 p-3 shadow-sm border text-white break-words hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
          <div className="text-sm">{content}</div>
        </Card>
      </div>
    </div>
  );
};

const AssistantMessage = ({content, fragment, createdAt, isActiveFragment, onFragmentClick, type}: AssistantMessageProps) => {
  const formattedDate = new Date(createdAt).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex justify-start pb-4 pl-2 pr-10">
      <div className="max-w-[80%]">
      <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={100}
            height={40}
            className="shrink-0"
            priority
          />
        </div>
        <span>{formattedDate}</span>
      </div>
      <Card className="rounded-lg bg-white p-3 shadow-sm border break-words hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
        <div className="text-sm">{content}</div>
        {type === MessageType.RESULT && (
          <FragmentCard 
            fragment={fragment}
            isActive={isActiveFragment}
            onClick={onFragmentClick}
          />
        )}
      </Card>
      </div>
    </div>
  );
};

const FragmentCard = ({ fragment, isActive, onClick }: FragmentCardProps) => {
  if (!fragment) return null;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onClick(fragment)}
      className={`mt-3 w-full text-left group relative overflow-hidden rounded-lg border p-3 text-xs
      transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
      hover:shadow-md active:shadow-sm
      hover:-translate-y-0.5 active:translate-y-0
      before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100
      ${
        isActive
        ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-inner'
        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2">
        {/* Import: import { Code2, ChevronRight } from 'lucide-react'; */}
        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-600 ring-1 ring-inset ring-blue-200 transition-colors duration-300 group-hover:bg-blue-500 group-hover:text-white">
        <Code2Icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6" />
        </span>
        <div>
        <div className="font-medium text-gray-900 line-clamp-2 transition-colors duration-200 group-hover:text-blue-600">
          {fragment.title}
        </div>
        <div className="mt-1 text-gray-600/90 transition-colors duration-200 group-hover:text-gray-700">
          Sandbox: <span className="font-mono text-[10px] break-all">{fragment.sandboxurl}</span>
        </div>
        </div>
      </div>
      <ChevronRightIcon className="mt-1 h-4 w-4 text-gray-400 transition-all duration-300 group-hover:text-blue-600 group-hover:translate-x-1" />
      </div>
      {isActive && (
      <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-blue-700">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
        Active fragment
      </div>
      )}
    </button>
  );
};

export const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type
}: MessageCardProps) => {
  if (role === MessageRole.USER) {
    return <UserMessage content={content} />;
  }
  
  return (
    <AssistantMessage 
      content={content}
      fragment={fragment}
      createdAt={createdAt}
      isActiveFragment={isActiveFragment}
      onFragmentClick={onFragmentClick}
      type={type}
    />
  );
};
