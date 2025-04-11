import { Input } from "../../../types/input";
import { MapJsonData } from "./../map-json-data";
import { CreateNewFile } from "./../manager/create-new-file";
import { GetJsonData } from "./../get-json-data";
import path from "path";
import { checkExist } from "./../manager/check-exist";
import { getFileId } from "./../manager/get-file-id";
import { db } from "../../../main";

export async function initializeDataBase() {
  // const db = new Database("sample.db");
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS scraping_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      platform TEXT,
      sort TEXT,
      category TEXT,
      endValue INTEGER,
      minPrice INTEGER,
      maxPrice INTEGER,
      freeShipping BOOLEAN NOT NULL,
      anonymousDelivery BOOLEAN NOT NULL,
      errorLimit INTEGER,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS forbidden_string (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target TEXT UNIQUE NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS forbidden_seller (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller TEXT UNIQUE NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS replacement_string (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target TEXT UNIQUE NOT NULL,
      value TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS price_setting (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      range INTEGER UNIQUE NOT NULL,
      value INTEGER NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS item_detail (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT UNIQUE,
      sku TEXT UNIQUE,
      name TEXT UNIQUE,
      price INTEGER,
      seller TEXT,
      main TEXT,
      sub_1 TEXT,
      sub_2 TEXT,
      sub_3 TEXT,
      sub_4 TEXT,
      sub_5 TEXT,
      sub_6 TEXT,
      sub_7 TEXT,
      sub_8 TEXT,
      description TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      size INTEGER,
      isFavorited INTEGER,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS task_result (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      file_id INTEGER,
      input_id INTEGER,
      description TEXT,
      price TEXT,
      spec TEXT,
      url TEXT,
      name TEXT,
      brand TEXT,
      janCode TEXT,
      category TEXT,
      imageQuantity INTEGER
    );
    `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS after_completion_file (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageDir TEXT,
      task_id INTEGER,
      file_id INTEGER,
      fileName TEXT,
      total INTEGER,
      completed INTEGER,
      canceled INTEGER
    );
    `
  ).run();
}
