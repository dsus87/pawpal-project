const commentSchema = new Schema({
    author: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    relatedPet: { 
      type: Schema.Types.ObjectId, 
      ref: 'Pet' 
    },
    content: String
  });
  
  const Comment = mongoose.model('Comment', commentSchema);