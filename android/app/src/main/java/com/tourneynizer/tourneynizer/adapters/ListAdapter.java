package com.tourneynizer.tourneynizer.adapters;

import android.app.Activity;
import android.content.Context;
import android.os.Parcel;
import android.os.Parcelable;
import android.support.annotation.LayoutRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.tourneynizer.tourneynizer.R;
import com.tourneynizer.tourneynizer.model.Tournament;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by ryanl on 2/3/2018.
 */

public class ListAdapter<T> extends ArrayAdapter<T> {

    public ListAdapter(Context c, @LayoutRes int layout) {
        super(c, layout);
    }

    public ArrayList<T> getAll() {
        ArrayList<T> values = new ArrayList<T>(getCount());
        for (int i = 0; i < getCount(); i++) {
            values.add(getItem(i));
        }
        return values;
    }
}
