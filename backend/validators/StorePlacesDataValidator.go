package validators

type StorePlaceDataValidator struct {
	Data struct {
		Type       string               `validate:"required,eq=places"`
		Attributes StorePlaceAttributes `json:"attributes"`
	} `json:"data"`
}

type StorePlaceAttributes struct {
	Name   string `validate:"required"`
	Adress string `validate:"required"`
}
