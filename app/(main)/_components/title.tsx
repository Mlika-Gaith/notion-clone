import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Document } from "@/types/document-types";
import React, { useRef, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocsStore } from "@/store/documents-store";
import updateDocument from "@/actions/update-document";

type Props = {
  initialData: Document;
};

export const Title = ({ initialData }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>(initialData.title || "Untitled");
  const [isEditing, setIsEditing] = useState(false);
  const updateDocumentState = useDocsStore((state) => state.updateDocument);

  useEffect(() => {
    setTitle(initialData.title || "Untitled");
  }, [initialData.title, setTitle]);

  const enableInput = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };
  const disableInput = () => {
    setIsEditing(false);
  };
  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const updatedDocument: Document = {
        ...initialData,
        title: title || "Untitled",
      };
      await updateDocument(updatedDocument, initialData._id);
      updateDocumentState(updatedDocument);
      disableInput();
    }
  };

  const onBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const updatedDocument: Document = {
      ...initialData,
      title: title || "Untitled",
    };
    await updateDocument(updatedDocument, initialData._id);
    updateDocumentState(updatedDocument);
    disableInput();
  };
  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={onBlur}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate font-bold text-xl font-crimson">
            {title}
          </span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-20 rounded-md" />;
};
