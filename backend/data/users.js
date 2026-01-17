import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin Krysto",
    email: "admin@krysto.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
    newsletterSubscribed: true,
    newsletterSubscribedAt: new Date("2024-01-15"),
    newsletterUnsubscribedAt: null,
  },
  {
    name: "Gyna Moreo",
    email: "gyna.moreo@email.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    newsletterSubscribed: true,
    newsletterSubscribedAt: new Date("2024-06-20"),
    newsletterUnsubscribedAt: null,
  },
  {
    name: "Jean-Pierre Moana",
    email: "jpmoana@lagoon.nc",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    newsletterSubscribed: false,
    newsletterSubscribedAt: new Date("2024-03-10"),
    newsletterUnsubscribedAt: new Date("2024-08-15"),
  },
  {
    name: "Sophie Martin",
    email: "sophie.martin@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    newsletterSubscribed: true,
    newsletterSubscribedAt: new Date("2024-09-01"),
    newsletterUnsubscribedAt: null,
  },
  {
    name: "Teva Teuru",
    email: "teva.teuru@outlook.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    newsletterSubscribed: false,
    newsletterSubscribedAt: null,
    newsletterUnsubscribedAt: null,
  },
];

export default users;