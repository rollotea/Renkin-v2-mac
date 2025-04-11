import { db } from "../../../main";

import { TaskResult } from "../../../types/task-result";
export function WriteTaskResult(taskResult: TaskResult) {
  // const db = new Database("sample.db");
  const insert = db.prepare(
    "INSERT INTO task_result (input_id,task_id,file_id,description,price,spec,url,name,brand,janCode,imageQuantity,category) VALUES (@input_id,@task_id,@file_id,@description,@price,@spec,@url,@name,@brand,@janCode,@imageQuantity,@category)"
  );
  insert.run({
    input_id: taskResult.input_id,
    task_id: taskResult.task_id,
    file_id: taskResult.file_id,
    description: taskResult.description,
    price: taskResult.price,
    spec: taskResult.spec,
    url: taskResult.url,
    name: taskResult.name,
    brand: taskResult.brand,
    janCode: taskResult.janCode,
    category: taskResult.category,
    imageQuantity: taskResult.imageQuantity,
  });
}
