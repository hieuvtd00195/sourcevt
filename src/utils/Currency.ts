class Currency {
  public FormatVND(value: number | null) {
    return value?.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'VND',
    });
  }

  public FormatNDT(value: number | null) {
    return value?.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'NDT',
    });
  }
}

const instance = new Currency();

export default instance;
