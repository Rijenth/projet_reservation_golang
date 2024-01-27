package validators

type StoreCommandDataValidator struct {
	Data struct {
		Type       string              `validate:"required,eq=commands"`
		Attributes StoreCommandAttributes `json:"attributes"`
	} `json:"data"`
}

type StoreCommandAttributes struct {
	Description	string `validate:"required"`
}
