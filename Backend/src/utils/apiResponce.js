// Define a class called apiResponce
class apiResponce {
  constructor(statuscode, data, message = "success") {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = statuscode < 400;
  }
}

// Export the apiResponce class as a named export
export { apiResponce };
