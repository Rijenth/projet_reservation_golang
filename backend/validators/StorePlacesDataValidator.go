
package validators


type StorePlacesDataValidator struct {
	Data struct {
		Type       string               `validate:"required,eq=places"`
		Attributes StorePlacesAttributes `json:"attributes"`	
	} `json:"data"`
}

type StorePlacesAttributes struct {
	Name string `validate:"required"`
	Adress string `validate:"required"`
}

