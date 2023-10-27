1. Key concepts RMQ
- Message Broker (Môi trường trung gian tin nhắn): Là một phần mềm trung gian chịu trách nhiệm nhận, lưu trữ và chuyển tiếp tin nhắn giữa các ứng dụng.
- Producer (Người gửi): Là một ứng dụng tạo ra tin nhắn và gửi chúng tới message broker để chuyển tới các consumer.
- Consumer (Người tiêu thụ): Là một ứng dụng nhận và xử lý các tin nhắn từ message broker.
Queue (Hàng đợi): Là một địa điểm lưu trữ tạm thời cho các tin nhắn trong khi chờ được xử lý bởi consumer.
- Exchange (Sàn giao dịch): Là một điểm trung gian mà producer gửi tin nhắn tới, nó định tuyến các tin nhắn tới hàng đợi phù hợp dựa trên các quy tắc xác định.
- Binding (Ràng buộc): Là quy tắc xác định cách mà một hàng đợi được ràng buộc với một sàn giao dịch, xác định cách thức định tuyến tin nhắn từ sàn giao dịch tới hàng đợi.
- Routing Key (Khóa định tuyến): Là một thuộc tính của tin nhắn được sử dụng để xác định cách thức định tuyến tin nhắn từ sàn giao dịch tới hàng đợi.
- Virtual Host (Máy chủ ảo): Là một không gian làm việc ảo, mỗi message broker có thể có nhiều máy chủ ảo, cung cấp cách cô lập và quản lý tài nguyên cho các ứng dụng khác nhau.
- Connection (Kết nối): Là một kết nối mạng giữa ứng dụng và message broker, cho phép ứng dụng gửi hoặc nhận tin nhắn.
- Channel (Kênh): Là một kênh truyền thông ảo trên một kết nối, cho phép nhiều luồng tin nhắn truy cập vào cùng một kết nối.

2. Cách hoạt động của RMQ
RabbitMQ là một hệ thống message broker hoạt động theo mô hình hoạt động phân tán giữa các producer và consumer thông qua các hàng đợi (queues). Dưới đây là mô tả về luồng hoạt động cơ bản của RabbitMQ:

1. **Producer gửi tin nhắn đến Exchange**:
   Producer (người gửi) tạo ra các tin nhắn và gửi chúng tới một exchange (sàn giao dịch). Exchange là điểm trung gian mà các producer gửi tin nhắn tới.

2. **Exchange định tuyến tin nhắn đến Queue**:
   Exchange sử dụng các quy tắc định tuyến như routing key hoặc các tiêu chí khác để quyết định chuyển tin nhắn tới queue (hàng đợi) phù hợp. Mỗi queue có thể được ràng buộc (binding) với một hoặc nhiều exchange.

3. **Consumer nhận và xử lý tin nhắn từ Queue**:
   Consumer (người tiêu thụ) đăng ký lắng nghe (subscribe) vào một hoặc nhiều queue. Khi có tin nhắn trong queue, RabbitMQ chuyển nó tới consumer để xử lý.

4. **Xác nhận (Acknowledge) và xử lý tin nhắn**:
   Sau khi consumer nhận được tin nhắn, nó xử lý và sau đó gửi xác nhận (acknowledge) cho RabbitMQ. Xác nhận này cho biết rằng tin nhắn đã được xử lý thành công. Nếu không nhận được xác nhận, RabbitMQ có thể chọn gửi lại tin nhắn hoặc chuyển nó tới một consumer khác.

5. **Hàng đợi có thể lưu trữ tin nhắn tạm thời**:
   Hàng đợi có thể lưu trữ các tin nhắn tạm thời nếu không có consumer nào đang lắng nghe. Các tin nhắn này sẽ đợi cho đến khi có consumer đăng ký lắng nghe hoặc được xóa do hết hạn.

Qua các bước trên, RabbitMQ cung cấp cơ chế linh hoạt và tin cậy để quản lý và phân phối các tin nhắn giữa các ứng dụng khác nhau trong môi trường phân tán.