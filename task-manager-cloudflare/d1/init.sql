-- d1/init.sql
CREATE TABLE IF NOT EXISTS tasks (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
description TEXT,
status TEXT NOT NULL DEFAULT 'todo',
priority INTEGER DEFAULT 1,
due_date TEXT,
created_at TEXT DEFAULT (datetime('now')),
updated_at TEXT DEFAULT (datetime('now'))
);