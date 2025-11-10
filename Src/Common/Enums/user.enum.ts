enum RoleEnum {
  USER = "user",
  ADMIN = "admin",
}

enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

enum PROVIDERENUM {
  GOOGLE = "google",
  LOCAL = "local",
}

enum otpTypesEnum {
  CONFIRMATION = "confirmation",
  RESET_PASSWORD = "reset_password",
}
enum friendShipStatusEnum{
  PENNDING="pending",
  ACCEPTED="accepted",
  REJECTED="rejected"
}

export { RoleEnum, GenderEnum, PROVIDERENUM, otpTypesEnum,friendShipStatusEnum };
