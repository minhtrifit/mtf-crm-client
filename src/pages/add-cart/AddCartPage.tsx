import CartsForm from './components/CartsForm/CartsForm';

const AddCartPage = () => {
  const handleSubmit = async (data: any) => {
    try {
      console.log('Add carts:', data);
    } catch (error) {
      console.log('Add carts failed:', error);
    }
  };

  return (
    <CartsForm defaultValues={null} isEdit={false} submitLoading={false} onFinish={handleSubmit} />
  );
};

export default AddCartPage;
