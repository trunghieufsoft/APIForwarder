using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WebApi.Sockets
{
    public class SocketService
    {
        public SocketService(RequestDelegate requestDelegate)
        {
            _requestDelegate = requestDelegate;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
            {
                await _requestDelegate.Invoke(context);
                return;
            }

            var token = context.RequestAborted;
            var socket = await context.WebSockets.AcceptWebSocketAsync();

            var guid = Guid.NewGuid().ToString();
            _sockets.TryAdd(guid, socket);

            while (true)
            {
                if (token.IsCancellationRequested)
                    break;

                var message = await GetMessageAsync(socket, token);
                Console.WriteLine($"Received message - {message} at {DateTime.Now}");

                if (string.IsNullOrEmpty(message))
                {
                    if (socket.State != WebSocketState.Open)
                        break;

                    continue;
                }

                foreach (var s in _sockets.Where(p => p.Value.State == WebSocketState.Open))
                    await SendMessageAsync(s.Value, message, token);
            }

            _sockets.TryRemove(guid, out _);

            await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Session ended", token);
            socket.Dispose();
        }

        private async Task<string> GetMessageAsync(WebSocket socket, CancellationToken token)
        {
            WebSocketReceiveResult result;
            var message = new ArraySegment<byte>(new byte[4096]);
            string receivedMessage;

            do
            {
                token.ThrowIfCancellationRequested();

                result = await socket.ReceiveAsync(message, token);
                var messageBytes = message.Skip(message.Offset).Take(result.Count).ToArray();
                receivedMessage = Encoding.UTF8.GetString(messageBytes);
            } while (!result.EndOfMessage);

            if (result.MessageType != WebSocketMessageType.Text)
                return null;

            return receivedMessage;
        }

        private Task SendMessageAsync(WebSocket socket, string message, CancellationToken token)
        {
            var byteMessage = Encoding.UTF8.GetBytes(message);
            var segmnet = new ArraySegment<byte>(byteMessage);

            return socket.SendAsync(segmnet, WebSocketMessageType.Text, true, token);
        }

        private readonly RequestDelegate _requestDelegate;
        private readonly ConcurrentDictionary<string, WebSocket> _sockets = new ConcurrentDictionary<string, WebSocket>();
    }
}