const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const { client } = require("../config/mongodb");

const stripe = require("stripe")(process.env.STRIPE_ID);
const database = client.db("YogaMaster");
const enrolledCollection = database.collection("enrolled");
const paymentCollection = database.collection("payment");

module.exports = { stripe, enrolledCollection, paymentCollection };
