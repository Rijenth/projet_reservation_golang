package validators


type StoreMenusDataValidator struct {
	Data struct {
		Type       string                `validate:"required,eq=places"`
		Attributes StoreMenusDataAttributes `json:"attributes"`
	} `json:"data"`
}


type StoreMenusDataAttributes struct {
	Name   string `validate:"required"`
	Price float64 `validate:"required"`
	
}

	


