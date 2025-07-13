class ApiResponse {
  constructor(statusCode,data, message= "sucess") {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp =  new Date().toISOString();
  }
}
module.exports = ApiResponse;

