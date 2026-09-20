import { toast } from "react-toastify";

const ERROR_MAP = {
  "Email is already registered": "این ایمیل قبلاً ثبت شده است.",
  "Invalid email or password": "ایمیل یا رمز عبور نادرست است.",
  "Account is deactivated": "حساب کاربری غیرفعال است.",
  "User not found": "کاربر پیدا نشد.",
  "File is required": "انتخاب فایل الزامی است.",
  "File is too large": "حجم فایل بیش از حد مجاز است.",
  "Storage quota exceeded": "فضای ذخیره‌سازی کافی نیست.",
  "File not found": "فایل پیدا نشد.",
  "Folder not found": "پوشه پیدا نشد.",
  "A file with this name already exists in this folder":
    "فایلی با این نام در این پوشه وجود دارد.",
  "A folder with this name already exists": "پوشه‌ای با این نام وجود دارد.",
  "Folder has subfolders. Remove them first.":
    "این پوشه زیرپوشه دارد. ابتدا آن‌ها را حذف کنید.",
  "File is not in trash": "این فایل در سطل زباله نیست.",
  "Stored file content is missing": "محتوای فایل روی سرور موجود نیست.",
  "Validation failed": "اطلاعات واردشده معتبر نیست.",
  "Route not found": "مسیر مورد نظر پیدا نشد.",
};

export function localizeMessage(message) {
  if (!message) return "خطای ناشناخته رخ داد.";
  if (ERROR_MAP[message]) return ERROR_MAP[message];

  const matched = Object.entries(ERROR_MAP).find(([en]) =>
    String(message).includes(en)
  );
  if (matched) return matched[1];

  return message;
}

export function notifyError(errorOrMessage) {
  if (!errorOrMessage) {
    toast.error("خطای ناشناخته رخ داد.");
    return;
  }

  if (typeof errorOrMessage === "string") {
    toast.error(localizeMessage(errorOrMessage));
    return;
  }

  if (Array.isArray(errorOrMessage.errors) && errorOrMessage.errors.length > 0) {
    toast.error(
      errorOrMessage.errors
        .map((item) => localizeMessage(item.message))
        .join(" · ")
    );
    return;
  }

  toast.error(localizeMessage(errorOrMessage.message));
}

export function notifySuccess(message) {
  toast.success(message);
}

export function notifyInfo(message) {
  toast.info(message);
}

export function notifyWarning(message) {
  toast.warning(message);
}
