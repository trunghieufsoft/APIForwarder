namespace WebApi.Common.Models
{
    public class ResponseModel
    {
        public ErrorModel Error { get; set; }

        public dynamic Data { get; set; }
    }
}
