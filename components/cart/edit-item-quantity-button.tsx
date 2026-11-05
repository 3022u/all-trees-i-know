'use client';

import clsx from 'clsx';
import { updateItemQuantity } from 'components/cart/actions';
import type { CartItem } from 'lib/shopify/types';
import { useActionState } from 'react';

function SubmitButton({ type }: { type: 'plus' | 'minus' }) {
  return (
    <button
      type="submit"
      aria-label={
        type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity'
      }
       onMouseDown={(e) => {
              e.currentTarget.classList.add('pressed-shadow');
            }}
            onTouchStart={(e) => {
              e.currentTarget.classList.add('pressed-shadow');
            }}
            onMouseUp={(e) => {
              e.currentTarget.classList.remove('pressed-shadow');
            }}
            onTouchEnd={(e) => {
              e.currentTarget.classList.remove('pressed-shadow');
            }}
      className={clsx(
        'rounded-full w-[2.8rem] h-[2.8rem] relative items-center justify-center flex transparent-shadow',
        {
          '': type === 'minus'
        }
      )}
    >
              {type === 'plus' &&  <span className='h-[1.8rem] bg-black w-[1px] absolute top-[calc(50%)] left-[calc(50%)] -translate-x-1/2 -translate-y-1/2'></span>}
            <span className='h-[1px] bg-black w-[1.8rem] absolute top-[calc(50%)] left-[calc(50%)] -translate-x-1/2 -translate-y-1/2'></span>

    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate
}: {
  item: CartItem;
  type: 'plus' | 'minus';
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        updateItemQuantityAction();
      }}
    >
      <SubmitButton type={type} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
