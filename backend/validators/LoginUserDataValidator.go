package validators

type LoginUserDataValidator struct {
	Username string `validate:"required"`
	Password string `validate:"required"`
}
