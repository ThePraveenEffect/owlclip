from azure.storage.queue import (
    QueueClient,
    BinaryBase64DecodePolicy,
    BinaryBase64EncodePolicy,
)

import json


class QueueService:
    def __init__(self, conn_str: str, queue_name: str):
        self.client = QueueClient.from_connection_string(
            conn_str,
            queue_name,
            message_encode_policy=BinaryBase64EncodePolicy(),
            message_decode_policy=BinaryBase64DecodePolicy(),
        )

        """
        Key Difference: dump vs dumps
        json.dumps() (with 's'): Takes a Python object and returns a standard JSON string format.
        json.dump() (no 's'): Takes a Python object and writes it directly to a file

        """
        try: 
            self.client.create_queue()
        except Exception:
            pass
        

    def enqueue(self, job_data: dict):
            message = json.dumps(job_data).encode('utf-8')
            self.client.send_message(message)
            
    def dequeue(self):
            messages = self.client.receive_messages(max_messages=1, visibility_timeout=300)
            
            """ 
             azure sending the message in the form of batch(page), message_per_page=1 defines,
             exactly that batch(page) have only one message.
            """
            
            
            for msg  in messages:
                    data = json.loads(msg.content)
                    return{
                        "id": msg.id,
                        "pop_receipt":msg.pop_receipt,
                        "data":data 
                    }
                    
            return None
        
    def delete(self, msg):
             self.client.delete_message(msg["id"], msg["pop_receipt"])


