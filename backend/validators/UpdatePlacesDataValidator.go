package validators

type UpdatePlacesDataValidator struct {
	Data struct {
		Type       string                `validate:"required,eq=places"`

		Attributes StorePlacesAttributes `json:"attributes"`
	} `json:"data"`
}

type UpdatePlacesAttributes struct {
	Name   string `validate:"required"`
	Adress string `validate:"required"`
}
