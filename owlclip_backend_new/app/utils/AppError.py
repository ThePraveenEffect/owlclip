

class AppException(Exception):
    def __init__(self, status_code: int, code: str, message: str, issues: list = None):
        self.status_code = status_code
        self.code = code
        self.message = message
        self.issues = issues or []
