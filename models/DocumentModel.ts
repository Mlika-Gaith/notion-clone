import mongoose, { Schema } from "mongoose";
import { IDocument } from "@/types/IDocument";

const DocumentSchema: Schema = new Schema<IDocument>({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  isArchived: {
    type: Boolean,
    required: true,
  },
  parentDocument: {
    type: Schema.Types.ObjectId,
    ref: "Document",
    default: null,
  },
  content: String,
  coverImage: String,
  icon: String,
  isPublished: {
    type: Boolean,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// creating indexes
DocumentSchema.index({ userId: 1 });
DocumentSchema.index({ userId: 1, parentDocument: 1 });

const DocumentModel =
  mongoose.models?.Document || mongoose.model("Document", DocumentSchema);

export { DocumentModel };
