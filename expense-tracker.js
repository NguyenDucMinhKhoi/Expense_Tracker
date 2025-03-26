#!/usr/bin/env node

const { count } = require("console");
const fs = require("fs");
const path = require("path");

const EXPENSES_FILE = path.join(__dirname, "expenses.json");

// Hàm tải danh sách chi phí từ file JSON (tạo file mới nếu chưa tồn tại)
function loadExpenses() {
  if (!fs.existsSync(EXPENSES_FILE)) {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify([]));
  }
  try {
    const data = fs.readFileSync(EXPENSES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading expenses file:", error);
    return [];
  }
}

// Hàm lưu danh sách chi phí vào file JSON
function saveExpenses(expenses) {
  try {
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
  } catch (error) {
    console.error("Error saving expenses file:", error);
  }
}

// Hàm phân tích các đối số dòng lệnh thàn một đối tượng { key: value }
function parseOptions(args) {
  let options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      let key = args[i].slice(2);
      if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        options[key] = args[i + 1];
        i++;
      } else {
        options[key] = true;
      }
    }
  }
  return options;
}

// Thêm chi phí mới với mô thả và số tiền
function addExpense(options) {
  if (!options.description || !options.amount) {
    console.log("Please provide --description and --amount.");
    return;
  }
  let amount = parseFloat(options.amount);
  if (isNaN(amount) || amount < 0) {
    console.log("Please provide a valid positive amount.");
    return;
  }
  const expenses = loadExpenses();
  const id = expenses.length ? expenses[expenses.length - 1].id + 1 : 1;
  const now = new Date().toISOString();
  const newExpense = {
    id,
    description: options.description,
    amount,
    createdAt: now,
    updatedAt: now,
  };
  expenses.push(newExpense);
  saveExpenses(expenses);
  console.log(`Expense added successfully (ID: ${id})`);
}

// Cập nhật chi phí dựa trên id (cập nhật mô tả và/hoặc số tiền)
function updateExpense(options) {
  if (!options.id) {
    console.log("Please provide --id to update an expense.");
    return;
  }
  const id = parseInt(options.id);
  if (isNaN(id)) {
    console.log("Invalid ID provided.");
    return;
  }
  const expenses = loadExpenses();
  const expense = expenses.find((exp) => exp.id === id);
  if (!expense) {
    console.log(`Expense with ID ${id} not found.`);
    return;
  }
  let updated = false;
  if (options.description) {
    expense.description = options.description;
    updated = true;
  }
  if (options.amount) {
    let amount = parseFloat(options.amount);
    if (isNaN(amount) || amount < 0) {
      console.log("Please provide a valid positive amount.");
      return;
    }
    expense.amount = amount;
    updated = true;
  }
  if (!updated) {
    console.log("Nothing to update. Provide --description and/or --amount.");
    return;
  }
  expense.updatedAt = new Date().toISOString();
  saveExpenses(expenses);
  console.log(`Expense with ID ${id} updated successfully.`);
}

// Xóa chi phí theo id
function deleteExpense(options) {
  if (!options.id) {
    console.log("Please provide --id to delete an expense.");
    return;
  }
  const id = parseInt(options.id);
  if (isNaN(id)) {
    console.log("Invalid ID provided.");
    return;
  }
  let expenses = loadExpenses();
  const initialLength = expenses.length;
  expenses = expenses.filter((exp) => exp.id !== id);
  if (expenses.length === initialLength) {
    console.log(`Expense with ID ${id} not found.`);
    return;
  }
  saveExpenses(expenses);
  console.log(`Expense with ID ${id} deleted successfully.`);
}

// Liệt kê tất cả chi phí (hiển thị ID, ngày tạo, mô tả, số tiền)
function listExpenses() {
  const expenses = loadExpenses();
  if (expenses.length === 0) {
    console.log("No expenses found.");
    return;
  }
  
  // Định dạng cột
  console.log("ID   Date         Description                Amount");
  console.log("----------------------------------------------------");
  
  expenses.forEach((exp) => {
    const date = exp.createdAt.slice(0, 10); // Lấy định dạng YYYY-MM-DD
    // Căn chỉnh các cột để dễ đọc
    const id = exp.id.toString().padEnd(4);
    const description = (exp.description || "").padEnd(25);
    console.log(`${id} ${date}  ${description} $${exp.amount.toFixed(2)}`);
  });
}

// Hiển thị tóm tắt chi phí: tổng số tiền, và nếu có tùy chọn --month thì chỉ cho tháng đó (năm hiện tại)
function summaryExpenses(options) {
  const expenses = loadExpenses();
  let filterExpenses = expenses;
  if (options.month) {
    let month = parseInt(options.month);
    if (isNaN(month) || month < 1 || month > 12) {
      console.log("Please provide a valid month (1-12).");
      return;
    }
    const currentYear = new Date().getFullYear();
    filterExpenses = expenses.filter((exp) => {
      let date = new Date(exp.createdAt);
      return (
        date.getFullYear() === currentYear && date.getMonth() + 1 === month
      );
    });
  }
  const total = filterExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  if (options.month) {
    console.log(`Total expenses for month ${options.month}: $${total}`);
  } else {
    console.log(`Total expenses: $${total}`);
  }
}

// Hàm main: phân tích đổi số dòng lệnh và gọi các chức năng tương ứng
function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log(`Usage:
      expense-tracker <command> [options]
      
      Commands:
        add --description "desc" --amount <amount>
        update --id <id> [--description "desc"] [--amount <amount>]
        delete --id <id>
        list
        summary [--month <month>]
      `);
    return;
  }
  const command = args[0];
  const options = parseOptions(args.slice(1));
  switch (command) {
    case "add":
      addExpense(options);
      break;
    case "update":
      updateExpense(options);
      break;
    case "delete":
      deleteExpense(options);
      break;
    case "list":
      listExpenses();
      break;
    case "summary":
      summaryExpenses(options);
      break;
    default:
      console.log("Invalid command.");
      break;
  }
}

main();
