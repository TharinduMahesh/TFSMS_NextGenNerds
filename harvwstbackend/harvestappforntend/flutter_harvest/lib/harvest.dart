class HarvestEntity{
 final int Id;
 final DateTime HarvestDate;
 final String SuperLeafWeight;
 final String NormalLeafWeight;
 final String TransportMethod;
 final String PaymentMethod;

 const HarvestEntity({
    required this.Id,
    required this.HarvestDate,
    required this.SuperLeafWeight,
    required this.NormalLeafWeight,
    required this.TransportMethod,
    required this.PaymentMethod,
});

    factory HarvestEntity.fromJson(Map<String, dynamic>json) => HarvestEntity(
        Id: json['Id'],
        HarvestDate: json['HarvestDate'],
        SuperLeafWeight: json['SuperLeafWeight'],
        NormalLeafWeight: json['NormalLeafWeight'],
        TransportMethod: json['TransportMethod'],
        PaymentMethod: json['PaymentMethod'],
    );

    Map<String, dynamic> toJson() => {
        "Id": Id,
        "HarvestDate": HarvestDate,
        "SuperLeafWeight": SuperLeafWeight,
        "NormalLeafWeight": NormalLeafWeight,
        "TransportMethod": TransportMethod,
        "PaymentMethod": TransportMethod,

    };
}
