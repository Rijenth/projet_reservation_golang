package validators

/*
	Voir StoreUserDataValidator pour les explications
*/

type UpdateUserDataValidator struct {
	Data struct {
		Type       string               `validate:"required,eq=users"`
		Id         string               `validate:"required,number"`
		Attributes UpdateUserAttributes `json:"attributes"`
	} `json:"data"`
}

type UpdateUserAttributes struct {
	FirstName string `validate:"omitempty"`
	LastName  string `validate:"omitempty"`
	Username  string `validate:"omitempty,min=4"`
	Password  string `validate:"omitempty,min=4"`
}
