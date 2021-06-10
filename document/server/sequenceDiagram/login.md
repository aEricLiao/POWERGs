```mermaid
sequenceDiagram
participant user
participant lambda
participant dynamodb

user ->> lambda: login API
Note right of user: loginid, password
```