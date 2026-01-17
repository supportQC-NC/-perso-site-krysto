import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez fournir une adresse email valide",
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    newsletterSubscribedAt: {
      type: Date,
      default: null,
    },
    newsletterUnsubscribedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware - Mise à jour des dates newsletter (syntaxe async)
userSchema.pre("save", async function () {
  if (this.isModified("newsletterSubscribed")) {
    if (this.newsletterSubscribed) {
      this.newsletterSubscribedAt = new Date();
      this.newsletterUnsubscribedAt = null;
    } else if (this.newsletterSubscribedAt) {
      this.newsletterUnsubscribedAt = new Date();
    }
  }
});

const User = mongoose.model("User", userSchema);

export default User;